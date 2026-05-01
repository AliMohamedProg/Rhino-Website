namespace Bl.DTOs;


public class CreateProjectRequest
{
    public string Name { get; set; }
    public string Description { get; set; }
    public Guid AllianceId { get; set; }
    public string MainImage { get; set; }
    public List<string> ImageUrls { get; set; } = new();
    public List<Guid> ProductIds { get; set; } = new();
}