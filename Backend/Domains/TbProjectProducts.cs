namespace Domains;

public class TbProjectProducts : BaseTable
{
    public Guid ItemId { get; set; }
    public Guid ProjectId { get; set; }

    // Nav properties
    public TbProjects Project { get; set; }
    public TbItem Item { get; set; }
}