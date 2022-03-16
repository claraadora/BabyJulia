abstract type Human end 
struct BabyHuman <: Human
    name::String 
    pottyTrainingLevel::Int64
end 
struct AdultHuman <: Human
    name::String
    job::String
end 

abstract type Emotion end 
struct Happy <: Emotion
    name::String
end 
struct Sad <: Emotion
    name::String
end 

# Construct 
julia = BabyHuman("Julia", 1)
profIlya = AdultHuman("Prof Ilya", "Professor")

happy = Happy("happy")
sad = Sad("sad")

function setMood(human::Human, emotion::Emotion) 
    return human.name * ": " * "* mood set to " * emotion.name * " *"
end

function setMood(baby::BabyHuman, emotion::Sad) 
    return baby.name * ": " * "hue hue hue hue....."
end

function setMood(baby::AdultHuman, emotion::Sad) 
    return baby.name * ": " * "I'm feeling blue..."
end

println(setMood(julia, happy))
println(setMood(profIlya, happy))

println(setMood(julia, sad))
setMood(profIlya, sad)