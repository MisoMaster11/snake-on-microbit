let snake_brightness = 100
let apple_brightness = 255
let direction = [1, 0]
let snake = [[1, 2], [2, 2]]
let apple = [0, 0]
let is_game_over = false
let can_turn = true
let can_restart = false
function reset() {
    
    direction = [1, 0]
    snake = [[1, 2], [2, 2]]
    apple = [0, 0]
    is_game_over = false
    can_turn = true
    led.stopAnimation()
    basic.clearScreen()
    plot_snake()
    spawn_apple()
    can_restart = false
}

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
    
    if (can_turn == true && !is_game_over) {
        direction = [direction[1], -direction[0]]
        can_turn = false
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    // doprava
    
    if (can_turn == true && !is_game_over) {
        direction = [-direction[1], direction[0]]
        can_turn = false
    }
    
})
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    if (can_restart) {
        reset()
    }
    
})
function game_over(icon: number) {
    
    is_game_over = true
    can_turn = false
    for (let i = 0; i < 3; i++) {
        basic.clearScreen()
        basic.pause(200)
        plot_snake()
        basic.pause(200)
    }
    basic.clearScreen()
    basic.showIcon(icon)
    basic.pause(700)
    basic.clearScreen()
    basic.pause(300)
    can_restart = true
    basic.showNumber(snake.length)
}

loops.everyInterval(500, function on_every_interval() {
    
    if (is_game_over == true) {
        return
    }
    
    let last_index = snake.length - 1
    let new_head_x = snake[last_index][0] + direction[0]
    let new_head_y = snake[last_index][1] + direction[1]
    if (new_head_x > 4 || new_head_x < 0 || new_head_y > 4 || new_head_y < 0) {
        game_over(IconNames.Skull)
        return
    }
    
    snake.push([new_head_x, new_head_y])
    if (new_head_x == apple[0] && new_head_y == apple[1]) {
        spawn_apple()
    } else {
        led.unplot(snake[0][0], snake[0][1])
        _py.py_array_pop(snake, 0)
    }
    
    for (let segment of snake.slice(0, -1)) {
        if (segment[0] == new_head_x && segment[1] == new_head_y) {
            game_over(IconNames.Skull)
            return
        }
        
    }
    led.plotBrightness(new_head_x, new_head_y, snake_brightness)
    can_turn = true
    if (snake.length >= 25) {
        game_over(IconNames.Diamond)
    }
    
})
