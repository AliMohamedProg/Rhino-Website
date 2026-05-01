using System;
using System.Collections.Generic;
using System.Text;
using Bl.DTOs;
using Domains;

namespace Bl.Contracts
{
    public interface IProjects : IBaseService<TbProjects, ProjectsDto>
    {
        public bool AddProject(CreateProjectRequest request);
        public bool UpdateProject(CreateProjectRequest request, Guid projectId); 
        public ProjectsDto? GetProjectById(Guid id);
        public List<ProjectsDto> GetAllProjects();
        public List<ProjectsDto> GetProjectsByAlliance(Guid allianceId);
    }
}
