namespace Domains;

public class TbCollectionImages : BaseTable
{
    public Guid Id { get; set; }

    public string ImageUrl { get; set; } = null!;

    public Guid CollectionId { get; set; }

    public virtual TbCollections Collection { get; set; } = null!;
}