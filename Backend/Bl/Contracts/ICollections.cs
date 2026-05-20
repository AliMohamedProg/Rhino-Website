using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bl.Contracts;
using Bl.DTOs;
using Domains;

namespace Bl.Contracts
{
    public interface ICollections : IBaseService<TbCollections, CollectionDto>
    {
        public Task<CollectionDto?> GetCollectionWithImagesAndFabrics(Guid id);
        public Task<List<CollectionDto>> GetAllCollectionsWithImagesAndFabrics();
        public bool AddCollectionWithImagesAndFabrics(CollectionDto collectionDto);
        public bool UpdateCollectionWithImagesAndFabrics(CollectionDto collectionDto);
    }
}