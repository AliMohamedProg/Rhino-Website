namespace Bl.DTOs;

public class CollectionImagesDto : BaseDto
{
    public string ImageUrl { get; set; } = null!;

    public Guid ProductId { get; set; }
}