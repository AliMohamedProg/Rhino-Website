namespace Domains;

public class TbChangeImages : BaseTable
{
    public string ImageUrl { get; set; }
    public Guid ChangeId { get; set; }
    public Guid TbChangesId { get; set; }
    
    public TbChanges TbChanges { get; set; }
}
