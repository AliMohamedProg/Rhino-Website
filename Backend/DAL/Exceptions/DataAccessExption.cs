using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Logging;

namespace DAL.Exceptions
{
    public class DataAccessExption : Exception
    {
        public DataAccessExption(Exception ex , string customMessage , ILogger logger)
            : base(string.IsNullOrWhiteSpace(customMessage) ? ex.Message : customMessage, ex)
        {
            logger.LogError(ex, "Data access exception. Custom Message: {CustomMessage}", customMessage);
        }
    }
}
