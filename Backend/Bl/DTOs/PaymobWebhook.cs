namespace Bl.DTOs
{
    /// <summary>
    /// Paymob sends this payload to the webhook endpoint after a transaction.
    /// Only the fields we actually use are mapped here.
    /// </summary>
    using System.Text.Json.Serialization;

    public class PaymobWebhook
    {
        public bool Success { get; set; }

        [JsonPropertyName("data")]
        public WebhookData Data { get; set; }
    }

    public class WebhookData
    {
        [JsonPropertyName("order")]
        public OrderData Order { get; set; }

        [JsonPropertyName("transaction_id")]
        public string TransactionId { get; set; }
    }

    public class OrderData
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }
    }
}
