using System.ComponentModel.DataAnnotations;

namespace Domains;

public class TbProjects :BaseTable
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required] public string Description { get; set; }
    public Guid AllianceId { get; set; } 
        public string MainImage { get; set; } = null!;

    // Nav properties
    public ICollection<TbProjectImages> Images { get; set; } = new List<TbProjectImages>();
    public TbAlliances Alliance { get; set; }
    public ICollection<TbProjectProducts> TbProjectProducts { get; set; } = new List<TbProjectProducts>();

}