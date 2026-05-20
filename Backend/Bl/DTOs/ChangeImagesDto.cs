namespace Bl.DTOs;

public class ChangeImagesDto : BaseDto
{
    public string ImageUrl { get; set; }
    public Guid ChangeId { get; set; }
    
    public ChangeDto? Changes { get; set; }
}