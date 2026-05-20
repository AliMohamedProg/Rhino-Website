namespace Bl.DTOs;

public class CollectionItemsDto
{
    public Guid ItemId { get; set; }
    public Guid CollectionId { get; set; }
    public ItemDto? Item { get; set; }
}