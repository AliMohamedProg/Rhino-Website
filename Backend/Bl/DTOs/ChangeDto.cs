namespace Bl.DTOs;

public class ChangeDto : BaseDto
{
    public string ChangeName { get; set; }
    public string NewDimensions { get; set; }
    public string NewSKU { get; set; }
    public decimal OverPrice { get; set; }
    public string NewName { get; set; }
    public string NewDescription { get; set; }
    public Guid CollectionId { get; set; }
   // public CollectionDto Collections { get; set; }
    public ICollection<ChangeImagesDto> ChangeImages { get; set; } = new List<ChangeImagesDto>();
}
