namespace Bl.DTOs;

public class OrderCollectionDto : BaseDto
{

    public Guid CollectionId { get; set; }
    public string Name { get; set; }
    public string MainImage { get; set; }
    public Guid OrderId { get; set; }

    public int Qty { get; set; }

    public decimal UnitPrice { get; set; }
}