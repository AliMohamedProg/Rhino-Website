using System;
using System.Collections.Generic;

namespace Domains;

public partial class TbCategory : BaseTable
{

    public string Name { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;
    public int? ProductsCount { get; set; }

    public virtual ICollection<TbItem> TbItems { get; set; } = new List<TbItem>();
    public virtual ICollection<TbCollections> TbCollections { get; set; } = new List<TbCollections>();

}
