using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bl.Contracts;
using Bl.DTOs;
using Domains;

namespace BusinessLayer.Contracts
{
    public interface IRefreshTokens : IBaseService<TbRefreshTokens, RefreshTokensDto>
    {
        public RefreshTokensDto GetByRefreshToken(string token);

        public Task<bool> Refresh(RefreshTokensDto tokenDto);
    }
}
