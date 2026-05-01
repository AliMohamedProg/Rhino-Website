using Bl.Contracts;
using Bl.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apis.Controllers
{
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjects _projectsService;

        public ProjectsController(IProjects projectsService)
        {
            _projectsService = projectsService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ProjectsDto>> Get()
        {
            try
            {
                var projects = _projectsService.GetAllProjects();
                if (projects == null)
                    return Ok(new List<ProjectsDto>());

                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public ActionResult<ProjectsDto> GetById(Guid id)
        {
            try
            {
                var project = _projectsService.GetProjectById(id);
                if (project == null)
                    return NotFound(new { success = false, message = "Project not found" });

                return Ok(project);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("by-alliance/{allianceId}")]
        public ActionResult<IEnumerable<ProjectsDto>> GetByAlliance(Guid allianceId)
        {
            try
            {
                var projects = _projectsService.GetProjectsByAlliance(allianceId);
                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("add-project")]
        public async Task<bool> Add(CreateProjectRequest request)
        {
            try
            {
                return _projectsService.AddProject(request);
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("edit-project/{id}")]
        public async Task<bool> Edit(Guid id, CreateProjectRequest request)
        {
            try
            {
                return _projectsService.UpdateProject(request, id);
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost("delete-project/{id}")]
        public async Task<bool> Delete(Guid id)
        {
            try
            {
                return _projectsService.MarkAsDeleted(id);
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}