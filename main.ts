let snake_brightness = 100
let apple_brightness = 255
let direction = [1, 0]
let snake = [[0, 2], [1, 2], [2, 2]]
let apple = [0, 0]
let is_game_over = false
function spawn_apple() {
    let new_x: number;
    let new_y: number;
    let overlap: boolean;
    
    let placed = false
    while (!placed) {
        new_x = randint(0, 4)
        new_y = randint(0, 4)
        overlap = false
        for (let segment of snake) {
            if (segment[0] == new_x && segment[1] == new_y) {
                overlap = true
                break
            }
            
        }
        if (!overlap) {
            apple = [new_x, new_y]
            placed = true
        }
        
    }
    led.plotBrightness(apple[0], apple[1], apple_brightness)
}

function plot_snake() {
    basic.clearScreen()
    for (let i of snake) {
        led.plotBrightness(i[0], i[1], snake_brightness)
    }
}

plot_snake()
spawn_apple()
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    // dolava
    
    direction = [direction[1], -direction[0]]
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    // doprava
    
    direction = [-direction[1], direction[0]]
})
function game_over() {
    
    is_game_over = true
    for (let i = 0; i < 3; i++) {
        basic.clearScreen()
        basic.pause(200)
        plot_snake()
        basic.pause(200)
    }
    basic.clearScreen()
    basic.showIcon(IconNames.Skull)
}

loops.everyInterval(500, function on_every_interval() {
    
    if (is_game_over == true) {
        return
    }
    
    let last_index = snake.length - 1
    let new_head_x = snake[last_index][0] + direction[0]
    let new_head_y = snake[last_index][1] + direction[1]
    if (new_head_x > 4 || new_head_x < 0 || new_head_y > 4 || new_head_y < 0) {
        game_over()
        return
    }
    
    for (let segment of snake) {
        if (segment[0] == new_head_x && segment[1] == new_head_y) {
            game_over()
            return
        }
        
    }
    if (new_head_x == apple[0] && new_head_y == apple[1]) {
        spawn_apple()
    } else {
        led.unplot(snake[0][0], snake[0][1])
        _py.py_array_pop(snake, 0)
    }
    
    snake.push([new_head_x, new_head_y])
    led.plotBrightness(new_head_x, new_head_y, snake_brightness)
})
