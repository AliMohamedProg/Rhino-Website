using System.ComponentModel.DataAnnotations;

namespace Bl.DTOs;

public class ProjectsDto : BaseDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required] public string Description { get; set; }
    public Guid AllianceId { get; set; } 
    public string MainImage { get; set; } = null!;

    // Nav properties
    public ICollection<ProjectImagesDto> Images { get; set; } = new List<ProjectImagesDto>();
    public ICollection<ItemDto> Products { get; set; } = new List<ItemDto>();  // ← full product

}