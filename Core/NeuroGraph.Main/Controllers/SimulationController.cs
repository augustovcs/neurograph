using Api.Entities;
using Interfaces;
using Microsoft.AspNetCore.Mvc;
using Neurograph.Services;

namespace Controller.Neurograph.main;


[ApiController]
[Route("[controller]")]
public class SimulationController : ControllerBase
{
   
    private readonly INeuronBehaviorService _behaviorService;
    private readonly INeuronGenerationService _generationService;
    private readonly INeuronResetService _resetService;

    public SimulationController(
                    INeuronBehaviorService behaviorService,
                    INeuronGenerationService generationService, 
                    INeuronResetService resetService) 
    {
        _behaviorService = behaviorService;
        _generationService = generationService;
        _resetService = resetService;
    }

    [HttpPost("tick")]
    public async Task<IActionResult> RunTick()
    {
        await _behaviorService.RunTickAsync();
        return Ok(new { message = "Tick processado com sucesso" });
    }

    [HttpPost("seed")]
    public async Task<IActionResult> SeedNeurons([FromQuery] int countNeurons)
    {

        await _generationService.LowNeuronSpawn(countNeurons);
        return Ok(new {message = $"Generated {countNeurons} Neurons with Success! "});
       
    }

    [HttpDelete("delete-all-neurons")]
    public async Task<IActionResult> DeleteAllNeurons()
    {
        await _resetService.ResetAllAsync();
        return Ok(new { message = "Deleted all neurons!"}); 
    }



}
