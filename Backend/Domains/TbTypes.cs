namespace Domains;

public class TbTypes : BaseTable
{
    public string Name { get; set; }
    public virtual ICollection<TbItem> TbItems { get; set; } = new List<TbItem>();
}