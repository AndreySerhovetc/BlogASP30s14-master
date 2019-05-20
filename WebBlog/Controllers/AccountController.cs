using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebBlog.DAL.Entities;
using WebBlog.Helpers;
using WebBlog.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
using System.Drawing.Imaging;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace WebBlog.Controllers
{
    [Produces("application/json")]
    [Route("api/Account")]
    //[RequireHttps]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<DbUser> _userManager;
        private readonly SignInManager<DbUser> _signInManager;
        private readonly EFContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _env;
        public AccountController(UserManager<DbUser> userManager,
            SignInManager<DbUser> signInManager, EFContext context,
            IConfiguration configuration, IHostingEnvironment env)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _configuration = configuration;
            _env = env;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]Credentials credentials)
        {
            if (!ModelState.IsValid)
            {
                
                return BadRequest(new { invalid="Problem validation" });
            }
           

            var result = await _signInManager
                .PasswordSignInAsync(credentials.Email, credentials.Password,
                false, false);
            if (!result.Succeeded)
            {
                return BadRequest(new { invalid = "Не правильно введені дані!" });
            }
            var user = await _userManager.FindByEmailAsync(credentials.Email);
            await _signInManager.SignInAsync(user, isPersistent: false);
            return Ok(CreateToken(user));
        }

        private string CreateToken(DbUser user)
        {
            var roles = _userManager.GetRolesAsync(user).Result;

            var claims = new List<Claim>()
            {
                //new Claim(JwtRegisteredClaimNames.Sub, user.Id)
                new Claim("id", user.Id),
                new Claim("name", user.UserName),
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim("roles", role));
            }

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("this is the secret phrase"));
            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(signingCredentials: signingCredentials, claims: claims);
            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]CustomRegisterModel model)
        {
            if(!ModelState.IsValid)
            {
                var errors = CustomValidator.GetErrorsByModel(ModelState);
                return BadRequest(errors);
            }
            if (model.Image.Contains(","))
            {
                model.Image = model.Image.Split(',')[1];
            }
            string imageName = null; 
            using (Bitmap bmp = model.Image.FromBase64StringToImage())
            {
                string fileDestrDir = _env.ContentRootPath;
                fileDestrDir = Path.Combine(fileDestrDir, _configuration.GetValue<string>("ImagePath"));
                imageName = $"{Guid.NewGuid().ToString()}.jpg";

                string fileSave = Path.Combine(fileDestrDir, imageName);
                bmp.Save(fileSave, ImageFormat.Jpeg);
                //bmp.Clone();
                //bmp = null;
            }

            var user = new DbUser
            {
                UserName = model.Email,
                Email = model.Email,
                Image = imageName

            };

            var result = await _userManager
                .CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest("Bad create user!");
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
            return Ok(CreateToken(user));
        }

    }
}