cmake_minimum_required(VERSION 3.22)

project(RythmDaw VERSION 1.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include the RHYTHM plugin
add_subdirectory(plugins/rythm-plugin)
