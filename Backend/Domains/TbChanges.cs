namespace Domains;

public class TbChanges : BaseTable
{
    public string ChangeName { get; set; }
    public string NewDimensions { get; set; }
    public string NewSKU { get; set; }
    public decimal OverPrice { get; set; }
    public string NewName { get; set; }
    public string NewDescription { get; set; }
    public Guid CollectionId { get; set; }

    public TbCollections TbCollections { get; set; }
    public ICollection<TbChangeImages> TbChangeImages { get; set; } = new List<TbChangeImages>();
}                          
