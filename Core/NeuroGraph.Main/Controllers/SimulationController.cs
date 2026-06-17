using NeuroGraph.Main.Dtos;
using NeuroGraph.Main.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Controller.Neurograph.main;


[ApiController]
[Route("api/[controller]")]
public class SimulationController : ControllerBase
{

    private readonly INeuronBehaviorService _behaviorService;
    private readonly INeuronGenerationService _generationService;
    private readonly INeuronResetService _resetService;
    private readonly ISimulationConfigService _configService;

    public SimulationController(
                    INeuronBehaviorService behaviorService,
                    INeuronGenerationService generationService,
                    INeuronResetService resetService,
                    ISimulationConfigService configService)
    {
        _behaviorService = behaviorService;
        _generationService = generationService;
        _resetService = resetService;
        _configService = configService;
    }

    [HttpPost("tick")]
    public async Task<IActionResult> RunTick()
    {
        await _behaviorService.RunTickAsync();
        return Ok(new MessageDto("Tick processado com sucesso"));
    }

    [HttpPost("seed")]
    public async Task<IActionResult> SeedNeurons([FromQuery] int countNeurons)
    {
        await _generationService.LowNeuronSpawn(countNeurons);
        return Ok(new MessageDto($"Generated {countNeurons} Neurons with Success!"));
    }

    [HttpDelete("delete-all-neurons")]
    public async Task<IActionResult> DeleteAllNeurons()
    {
        await _resetService.ResetAllAsync();
        return Ok(new MessageDto("Deleted all neurons!"));
    }

    [HttpGet("config")]
    public async Task<ActionResult<SimulationConfigDto>> GetConfig()
        => Ok(await _configService.GetConfigAsync());

    [HttpPut("config")]
    public async Task<ActionResult<SimulationConfigDto>> UpdateConfig([FromBody] SimulationConfigDto dto)
        => Ok(await _configService.UpdateConfigAsync(dto));
}
