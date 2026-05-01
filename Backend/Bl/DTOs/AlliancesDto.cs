namespace Bl.DTOs;

public class AlliancesDto : BaseDto
{
    public string Name { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;
    public ICollection<ProjectsDto> Projects { get; set; } = new List<ProjectsDto>();

}