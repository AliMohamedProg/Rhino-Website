using Bl.DTOs;
using Domains;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Bl.Contracts;

public interface IChanges : IBaseService<TbChanges,ChangeDto>
{
    public CollectionDto GetCollectionWithChange(Guid collectionId, Guid? changeId);
}