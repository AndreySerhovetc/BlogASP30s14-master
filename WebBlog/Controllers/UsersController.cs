using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebBlog.DAL.Entities;
using WebBlog.ViewModels;

namespace WebBlog.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly EFContext _context;
        public UsersController( EFContext context)
        {
            _context = context;
        }
        [HttpGet]
        public List<UserItemViewModel> GetUsers()
        {
            var model = _context 
                .Users
                .Select(u => new UserItemViewModel
                {
                    Id=u.Id,
                    Email=u.Email,
                    Roles = u.UserRoles.Select(r => new RoleItemViewModel
                    {
                        Id=r.Role.Id,
                        Name=r.Role.Name
                    })
                })
                .ToList();
            return model;
        }
    }
}