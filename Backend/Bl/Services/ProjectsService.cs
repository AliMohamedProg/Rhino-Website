    using System;
    using System.Collections.Generic;
    using System.Text;
    using AutoMapper;
    using Bl.Contracts;
    using Bl.DTOs;
    using BusinessLayer.Contracts;
    using BusinessLayer.Services;
    using DAL.Contracts;
    using Domains;

    namespace Bl.Services
    {
public class ProjectsService : BaseService<TbProjects, ProjectsDto>, IProjects
{
    private readonly ITableRepository<TbProjectImages> _imageRepository;
    private readonly ITableRepository<TbProjectProducts> _projectProductRepository;
    private readonly ITableRepository<TbItem> _itemRepository;

    public ProjectsService(
        ITableRepository<TbProjects> repository,
        IMapper mapper,
        IUserService userService,
        ITableRepository<TbProjectImages> imageRepository,
        ITableRepository<TbProjectProducts> projectProductRepository,
        ITableRepository<TbItem> itemRepository)
        : base(repository, mapper, userService)
    {
        _imageRepository = imageRepository;
        _projectProductRepository = projectProductRepository;
        _itemRepository = itemRepository;
    }

    public bool AddProject(CreateProjectRequest request)
    {
        var createdBy = userService.GetLoggedInUser();
        var now = DateTime.Now;
        var projectId = Guid.NewGuid();

        var project = new TbProjects
        {
            Id = projectId,
            Name = request.Name,
            Description = request.Description,
            AllianceId = request.AllianceId,
            CurrentState = 1,
            CreatedBy = createdBy,
            CreatedDate = now,
            MainImage = request.MainImage,
            Images = request.ImageUrls.Select(url => new TbProjectImages
            {
                Id = Guid.NewGuid(),
                ImageUrl = url,
                ProjectId = projectId,
                CurrentState = 1,
                CreatedBy = createdBy,
                CreatedDate = now
            }).ToList()
        };

        var result = repository.Add(project);
        if (!result) return false;

        foreach (var itemId in request.ProductIds)
        {
            _projectProductRepository.Add(new TbProjectProducts
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                ItemId = itemId,
                CurrentState = 1,
                CreatedBy = createdBy,
                CreatedDate = now
            });
        }

        return true;
    }

    public bool UpdateProject(CreateProjectRequest request, Guid projectId)
    {
        var projects = repository.GetList<TbProjects>(
            filter: p => p.Id == projectId && p.CurrentState > 0,
            selector: null,
            orderBy: null,
            isDescending: false,
            p => p.Images,
            p => p.TbProjectProducts
        ).GetAwaiter().GetResult();

        var project = projects.FirstOrDefault();
        if (project == null) return false;

        var updatedBy = userService.GetLoggedInUser();
        var now = DateTime.Now;

        project.Name = request.Name;
        project.Description = request.Description;
        project.AllianceId = request.AllianceId;
        project.UpdatedBy = updatedBy;
        project.UpdatedDate = now;

        // Update images
        foreach (var oldImg in project.Images)
            _imageRepository.Delete(oldImg.Id);

        foreach (var url in request.ImageUrls)
        {
            _imageRepository.Add(new TbProjectImages
            {
                Id = Guid.NewGuid(),
                ImageUrl = url,
                ProjectId = projectId,
                CurrentState = 1,
                CreatedBy = updatedBy,
                CreatedDate = now
            });
        }

        // Update products
        foreach (var oldPp in project.TbProjectProducts)
            _projectProductRepository.Delete(oldPp.Id);

        foreach (var itemId in request.ProductIds)
        {
            _projectProductRepository.Add(new TbProjectProducts
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                ItemId = itemId,
                CurrentState = 1,
                CreatedBy = updatedBy,
                CreatedDate = now
            });
        }

        return repository.Update(project);
    }
    

    public ProjectsDto? GetProjectById(Guid id)
    {
        var projects = repository.GetList<TbProjects>(
            filter: p => p.Id == id && p.CurrentState > 0,
            selector: null,
            orderBy: null,
            isDescending: false,
            p => p.Images,
            p => p.Alliance,
            p => p.TbProjectProducts
        ).GetAwaiter().GetResult();

        var project = projects.FirstOrDefault();
        return project == null ? null : MapToDto(project);
    }

    public List<ProjectsDto> GetAllProjects()
    {
        var projects = repository.GetList<TbProjects>(
            filter: p => p.CurrentState > 0,
            selector: null,
            orderBy: null,
            isDescending: false,
            p => p.Images,
            p => p.Alliance,
            p => p.TbProjectProducts
        ).GetAwaiter().GetResult();

        return projects.Select(MapToDto).ToList();
    }

    public List<ProjectsDto> GetProjectsByAlliance(Guid allianceId)
    {
        var projects = repository.GetList<TbProjects>(
            filter: p => p.CurrentState > 0 && p.AllianceId == allianceId,
            selector: null,
            orderBy: null,
            isDescending: false,
            p => p.Images,
            p => p.Alliance,
            p => p.TbProjectProducts
        ).GetAwaiter().GetResult();

        return projects.Select(MapToDto).ToList();
    }

    private ProjectsDto MapToDto(TbProjects p)
    {
        var productIds = p.TbProjectProducts
            .Where(pp => pp.CurrentState > 0)
            .Select(pp => pp.ItemId)
            .ToList();

        var items = _itemRepository.GetList<TbItem>(
            filter: i => productIds.Contains(i.Id) && i.CurrentState > 0,
            selector: null,
            orderBy: null,
            isDescending: false,
            i => i.TbImages,
            i => i.TbFabrics
        ).GetAwaiter().GetResult();

        return new ProjectsDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            AllianceId = p.AllianceId,
            CurrentState = p.CurrentState,
            CreatedDate = p.CreatedDate,
            Images = p.Images
                .Where(i => i.CurrentState > 0)
                .Select(i => new ProjectImagesDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    ProjectId = i.ProjectId,
                    CurrentState = i.CurrentState,
                    CreatedDate = i.CreatedDate
                }).ToList(),
            Products = Mapper.Map<List<TbItem>, List<ItemDto>>(items)
        };
    }
}
    }
