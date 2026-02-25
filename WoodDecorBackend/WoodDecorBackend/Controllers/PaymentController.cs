using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace Apis.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymobPayment _paymobService;
        private readonly IOrder _orderService;
        private readonly IConfiguration _config;

        public PaymentController(IPaymobPayment paymobService, IOrder orderService, IConfiguration config)
        {
            _paymobService = paymobService;
            _orderService = orderService;
            _config = config;
        }

        // ─── 1. Create payment intention ───────────────────────────────────────
        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentRequest request)
        {
            try
            {
                var result = await _paymobService.CreatePayment(
                    request.Amount,
                    request.Email,
                    request.FirstName,
                    request.LastName,
                    request.PhoneNumber,
                    request.OrderId ?? Guid.NewGuid().ToString(),
                    request.PaymentMethod);

                return Ok(new
                {
                    clientSecret = result.ClientSecret,
                    redirectUrl = result.RedirectUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook()
        {

            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();

            // 1️⃣ Verify Signature أول حاجة
            if (!VerifySignature(body))
                return Unauthorized("Invalid Signature");

            var request = JsonSerializer.Deserialize<PaymobWebhook>(body);

            if (request == null)
                return BadRequest();

            // 2️⃣ تحقق إن الحالة Paid فعلاً من Paymob
            if (request.Success)
            {
                await _paymobService.MarkOrderAsPaid(request.Data.OrderId);
            }

            return Ok();

        }
        private bool VerifySignature(string body)
        {
            var secret = _config["Paymob:HmacSecret"];
            var signatureHeader = Request.Headers["HMAC"].FirstOrDefault();

            if (string.IsNullOrEmpty(secret) || string.IsNullOrEmpty(signatureHeader))
                return false;

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(body));

            var computedSignature = BitConverter
                .ToString(hash)
                .Replace("-", "")
                .ToLower();

            return computedSignature == signatureHeader.ToLower();
        }
    }
}

