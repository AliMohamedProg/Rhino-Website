using System.Net.Http.Json;
using System.Text.Json;
using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Bl.Services
{
    public class PaymobService : IPaymobPayment
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly IOrder _orderService;

        public PaymobService(HttpClient httpClient, IConfiguration config, IOrder orderService)
        {
            _httpClient = httpClient;
            _config = config;
            _orderService = orderService;
        }

        public async Task<PaymobPaymentResult> CreatePayment(
            int amount,
            string email,
            string firstName,
            string lastName,
            string phone,
            string orderId,
            string paymentMethod)
        {
            // ── Build payment_methods list ─────────────────────────────────────
            // Paymob v1 Unified Checkout accepts either integer integration IDs
            // or the string "WALLET" for mobile wallet.
            object[] paymentMethods;


            if (paymentMethod == "card")
            {
                var cardId = int.Parse(_config["Paymob:CardIntegrationId"]);
                paymentMethods = new object[] { cardId };
            }
            else if (paymentMethod == "wallet")
            {
                var walletId = int.Parse(_config["Paymob:WalletIntegrationId"]);
                paymentMethods = new object[] { walletId };
            }
            else
            {
                throw new Exception("Invalid payment method");
            }

            // ── Build request body ─────────────────────────────────────────────
            var requestBody = new
            {
                amount = amount * 100,          // EGP → Piasters
                currency = "EGP",
                payment_methods = paymentMethods,
                items = new[]
                {
                    new
                    {
                        name     = "Order",
                        amount   = amount * 100,
                        quantity = 1
                    }
                },
                billing_data = new
                {
                    email,
                    first_name   = firstName,
                    last_name    = lastName,
                    phone_number = phone
                },
                // ← This is echoed back in the webhook as merchant_order_id
                merchant_order_id = orderId,
                extras = new { order_id = orderId },
                // ← After payment, Paymob redirects to this URL with ?success=true/false&id=TX_ID
                redirection_url = "http://localhost:3000/order-success"
            };

            // ── Call Paymob ────────────────────────────────────────────────────
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue(
                    "Bearer", _config["Paymob:SecretKey"]);

            var response = await _httpClient.PostAsJsonAsync(
                "https://accept.paymob.com/v1/intention/",
                requestBody);

            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Paymob intention failed: {json}");

            using var doc = JsonDocument.Parse(json);
            var clientSecret = doc.RootElement.GetProperty("client_secret").GetString();

            var publicKey   = _config["Paymob:PublicKey"];
            var redirectUrl = $"https://accept.paymob.com/unifiedcheckout/?publicKey={publicKey}&clientSecret={clientSecret}";

            return new PaymobPaymentResult
            {
                ClientSecret = clientSecret,
                RedirectUrl  = redirectUrl
            };
        }

        public async Task<bool> Refund(string transactionId, decimal amount)
        {
            try
            {
                var apiKey = _config["Paymob:ApiKey"];

                // 1️⃣ Get Auth Token
                var authResponse = await _httpClient.PostAsJsonAsync("https://accept.paymob.com/api/auth/tokens", new { api_key = apiKey });
                if (!authResponse.IsSuccessStatusCode)
                    return false;

                var authJson = await authResponse.Content.ReadAsStringAsync();
                using var authDoc = JsonDocument.Parse(authJson);
                var authToken = authDoc.RootElement.GetProperty("token").GetString();

                // 2️⃣ Call Refund
                var refundRequestBody = new
                {
                    auth_token = authToken,
                    transaction_id = long.Parse(transactionId),
                    amount_cents = (int)(amount * 100) // EGP to Piasters
                };

                var refundResponse = await _httpClient.PostAsJsonAsync(
                    "https://accept.paymob.com/api/acceptance/void_refund/refund",
                    refundRequestBody);

                return refundResponse.IsSuccessStatusCode;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
