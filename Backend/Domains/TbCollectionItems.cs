namespace Domains;

public class TbCollectionItems : BaseTable
{
    public Guid ItemId { get; set; }
    public Guid CollectionId { get; set; }

    // Nav properties
    public TbCollections Collection { get; set; }
    public TbItem Item { get; set; }
}