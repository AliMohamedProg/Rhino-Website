    using Bl.Contracts;
    using Bl.DTOs;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Apis.Models;

    namespace Apis.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        public class ProjectController : ControllerBase
        {
            private readonly IProjects _projectsService;

            public ProjectController(IProjects projectsService)
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
        }
    }