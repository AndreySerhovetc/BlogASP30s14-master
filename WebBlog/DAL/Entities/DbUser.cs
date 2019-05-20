using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebBlog.DAL.Entities
{
    public class DbUser : IdentityUser
    {
        [StringLength(255)]
        public string Image { get; set; }
        public ICollection<DbUserRole> UserRoles { get; set; }
    }
}
