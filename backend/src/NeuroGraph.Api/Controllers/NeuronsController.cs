using Microsoft.AspNetCore.Mvc;
using NeuroGraph.Application.Neurons;

namespace NeuroGraph.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NeuronsController : ControllerBase
{
    private readonly INeuronService _neurons;

    public NeuronsController(INeuronService neurons) => _neurons = neurons;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<NeuronDto>>> GetAll(CancellationToken ct)
        => Ok(await _neurons.GetAllAsync(ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NeuronDto>> GetById(Guid id, CancellationToken ct)
    {
        var neuron = await _neurons.GetByIdAsync(id, ct);
        return neuron is null ? NotFound() : Ok(neuron);
    }

    [HttpPost]
    public async Task<ActionResult<NeuronDto>> Create(CreateNeuronRequest request, CancellationToken ct)
    {
        var created = await _neurons.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
