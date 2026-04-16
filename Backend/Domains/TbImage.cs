using System;
using System.Collections.Generic;

namespace Domains;

public partial class TbImage:BaseTable
{
    public Guid Id { get; set; }

    public string ImageUrl { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Guid? UpdatedBy { get; set; }

    public int CurrentState { get; set; }

    public DateTime? CreatedDate { get; set; }

    public Guid CreatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual TbItem Product { get; set; } = null!;
}
