namespace Apis.Models
{
    public class AddCartItemRequest
    {
        public Guid ProductId { get; set; }
        public int StockNumber { get; set; }
        public string Color { get; set; }
    }
}
