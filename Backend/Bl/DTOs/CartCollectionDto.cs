namespace Bl.DTOs;

public class CartCollectionDto : BaseDto
{
        public Guid CollectionId { get; set; }
        public int Quantity { get; set; }
        public decimal Total { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string? Color { get; set; }
        public string? Fabric { get; set; }
        public decimal Price { get; set; }
        public Guid UserId { get; set; }
}