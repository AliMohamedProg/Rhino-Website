using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Bl.Contracts;
using Bl.DTOs;
using BusinessLayer.Contracts;
using BusinessLayer.Services;
using DAL.Contracts;
using Domains;
using Microsoft.VisualBasic;

namespace Bl.Services
{
    public class RefreshTokensService : BaseService<TbRefreshTokens, RefreshTokensDto>, IRefreshTokens
    {
        ITableRepository<TbRefreshTokens> _repository;
        IMapper _Mapper;
        public RefreshTokensService(ITableRepository<TbRefreshTokens> repository, IMapper Mapper, IUserService userService)
            : base(repository, Mapper, userService)
        {
            _repository = repository;
            _Mapper = Mapper;
        }

        public RefreshTokensDto GetByRefreshToken(string token)
        {
            var refreshToken = _repository.GetFirstOrDefault(x => x.Token == token);
            return _Mapper.Map<TbRefreshTokens,RefreshTokensDto>(refreshToken);
        }

        public async Task<bool> Refresh(RefreshTokensDto tokenDto)
        {
            var tokenList = await _repository.GetList(a => a.UserId == tokenDto.UserId && a.CurrentState == 1);
            foreach (var token in tokenList)
            {
                _repository.MarkAsDeleted(token.Id , Guid.Parse(token.UserId),2);
            }
            var newToken = _Mapper.Map<RefreshTokensDto, TbRefreshTokens>(tokenDto);
            _repository.Add(newToken);
            return true;
        }
    }
}
