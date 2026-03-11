snake_brightness = 100
apple_brightness = 255

direction = (1, 0)
snake = [(0, 2), (1, 2), (2, 2)]
apple = (0, 0)
is_game_over = False

def spawn_apple():
    global apple
    placed = False
    while not placed:
        new_x = randint(0, 4)
        new_y = randint(0, 4)
        
        overlap = False
        for segment in snake:
            if segment[0] == new_x and segment[1] == new_y:
                overlap = True
                break
                
        if not overlap:
            apple = (new_x, new_y)
            placed = True
            
    led.plot_brightness(apple[0], apple[1], apple_brightness)

def plot_snake():
    basic.clear_screen()
    for i in snake:
        led.plot_brightness(i[0], i[1], snake_brightness)

plot_snake()
spawn_apple()

def on_button_pressed_a(): #dolava
    global direction
    direction = (direction[1], -direction[0])
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b(): #doprava
    global direction
    direction = (-direction[1], direction[0])
input.on_button_pressed(Button.B, on_button_pressed_b)

def game_over():
    global is_game_over
    is_game_over = True
    for i in range(3):
        basic.clear_screen()
        basic.pause(200)
        plot_snake()
        basic.pause(200)
    basic.clear_screen()
    basic.show_icon(IconNames.SKULL)

def on_every_interval():
    global snake
    if is_game_over == True:
        return
    last_index = len(snake) - 1
    new_head_x = snake[last_index][0] + direction[0]
    new_head_y = snake[last_index][1] + direction[1]
    
    if new_head_x > 4 or new_head_x < 0 or new_head_y > 4 or new_head_y < 0:
        game_over()
        return
    
    for segment in snake:
        if segment[0] == new_head_x and segment[1] == new_head_y:
            game_over()
            return

    if new_head_x == apple[0] and new_head_y == apple[1]:
        spawn_apple()
    else:
        led.unplot(snake[0][0], snake[0][1])
        snake.pop(0)

    snake.append((new_head_x, new_head_y))
    led.plot_brightness(new_head_x, new_head_y, snake_brightness)
    
loops.every_interval(500, on_every_interval)