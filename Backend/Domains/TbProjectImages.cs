namespace Domains;

public class TbProjectImages :BaseTable
{
    public string ImageUrl { get; set; }
    public Guid ProjectId {get; set;}
    
    // Nav property
    public TbProjects Project { get; set; }
}