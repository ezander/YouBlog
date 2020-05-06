This post is an extract from my presentation at the recent [GoCon spring conference](http://gocon.connpass.com/event/27521/) in Tokyo, Japan.

# Errors are just values

I’ve spent a lot of time thinking about the best way to handle errors in Go programs. I really wanted there to be a single way to do error handling, something that we could teach all Go programmers by rote, just as we might teach mathematics, or the alphabet.

However, I have concluded that there is no single way to handle errors. Instead, I believe Go’s error handling can be classified into the three core strategies.

# Sentinel errors

The first category of error handling is what I call _sentinel errors_.


The name descends from the `practice` in computer programming of using a specific value to signify that no further processing is possible. So to with Go, we use specific values to signify an error.
