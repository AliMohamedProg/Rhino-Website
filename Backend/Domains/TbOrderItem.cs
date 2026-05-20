using System;
using System.Collections.Generic;

namespace Domains;

public partial class TbOrderItem : BaseTable
{

    public Guid ItemId { get; set; }
    public string Name { get; set; }
    public string MainImage { get; set; }
    public Guid OrderId { get; set; }

    public int Qty { get; set; }

    public decimal UnitPrice { get; set; }

    public virtual TbItem Item { get; set; } = null!;

    public virtual TbOrder Order { get; set; } = null!;
}
