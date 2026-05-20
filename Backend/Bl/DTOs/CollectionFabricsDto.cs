namespace Bl.DTOs;

public class CollectionFabricsDto: BaseDto
{
    public string Name { get; set; }

    public string ImageUrl { get; set; } = null!;

    public Guid CollectionId { get; set; }
}