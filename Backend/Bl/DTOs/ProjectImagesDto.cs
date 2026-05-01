namespace Bl.DTOs;

public class ProjectImagesDto : BaseDto
{
    public string ImageUrl { get; set; }
    public Guid ProjectId {get; set;}
}