namespace Domains;

public class TbCollectionFabrics : BaseTable
{
    public string Name { get; set; }
    public string ImageUrl { get; set; } = null!;

    public Guid CollectionId { get; set; }
    public virtual TbCollections Collection { get; set; } = null!;
}