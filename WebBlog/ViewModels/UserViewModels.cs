using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebBlog.ViewModels
{
    public class UserItemViewModel
    {
        public string Id { get; set; }
        public string Email { get; set; }

        public IEnumerable<RoleItemViewModel> Roles { get; set; }

    }
    public class RoleItemViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
