import os
import pydub
import pathlib
import datetime

# User variables here:
INPUT_DIR = "input"
OUTPUT_DIR = "output"
LOG_FILE = "log.txt"

# End of user variables

# Get the absolute paths to the folders specified above in case the user gave a relative path
INPUT_DIR = os.path.abspath(INPUT_DIR)
OUTPUT_DIR = os.path.abspath(OUTPUT_DIR)


# Audio silence remover from https://stackoverflow.com/questions/29547218/remove-silence-at-the-beginning-and-at-the-end-of-wave-files-with-pydub
def detect_leading_silence(sound, silence_threshold=-50.0, chunk_size=10):
    trim_ms = 0
    assert chunk_size > 0  # to avoid infinite loop
    while sound[trim_ms:trim_ms+chunk_size].dBFS < silence_threshold and trim_ms < len(sound):
        trim_ms += chunk_size
    return trim_ms


# Returns a list of all file paths inside a parent directory recursively, does not return folders
def get_all_files_in_dir(parent_path):
    all_files = []
    for path in os.listdir(parent_path):
        path = os.path.join(parent_path, path)
        if os.path.isfile(path):
            all_files.append(path)
        elif os.path.isdir(path):  # This is a directory, so get files inside of it
            all_files += (get_all_files_in_dir(path))  # Recursively add songs inside child dir
    return all_files


# Given a list of files, return a list of only the .wav ones
def filter_to_wav(file_paths):
    wav = []
    for path in file_paths:
        name, ext = os.path.splitext(path)
        if ext == ".wav":
            wav.append(path)
    return wav


# Gets the full path to the new mp3 file given a wav file and the output directory where the new file should be saved
def get_new_file_name(old_file_name, output_directory):
    drive_letter, old_file_name_without_drive = os.path.splitdrive(old_file_name)
    old_file_name_without_extension = os.path.splitext(old_file_name_without_drive)[0]
    partial_new_file_name = old_file_name_without_extension + ".mp3"
    new_file_name = output_directory + partial_new_file_name

    # Workaround for Microsoft's Windows maximum path issue
    new_file_name = new_file_name.replace(
        'N:\\Programming\\Python\\WAV to MP3 Converter GIT\\output\\Programming\\Python\WAV to MP3 Converter GIT\input\\',
        'N:\\Programming\\Python\\WAV to MP3 Converter GIT\\output\\'
    )

    return new_file_name


# Performs the audio conversion from wav to mp3 and handles logging it
def convert_wav_to_mp3(wav_path, mp3_path):
    global LOG_FILE
    if os.path.exists(mp3_path):
        #print("Already converted {}".format(mp3_path))
        return  # Don't do anything if the mp3 already exists
    start_time = datetime.datetime.now()
    parent_dir = pathlib.Path(mp3_path).parent
    pathlib.Path(parent_dir).mkdir(parents=True, exist_ok=True)
    song = pydub.AudioSegment.from_wav(wav_path)
    #start_trim = detect_leading_silence(song)
    #end_trim = detect_leading_silence(song.reverse())
    #duration = len(song)
    #song = song[start_trim:duration-end_trim]  # Remove silence from beginning and end
    try:
        song.export(mp3_path, format="mp3")
    except Exception as e:
        with open(LOG_FILE, "a") as f:
            f.write("Error with file: \"{}\". + {}\n".format(wav_path, e))
        return
    song_title = os.path.basename(mp3_path).encode("ascii", errors="ignore").decode()  # Sanitize for file writing
    wav_size = os.stat(wav_path).st_size / 1_000_000  # Convert bytes to megabytes
    mp3_size = os.stat(mp3_path).st_size / 1_000_000
    percent_smaller = ((wav_size - mp3_size) / wav_size) * 100
    end_time = datetime.datetime.now()
    delta_time = end_time - start_time
    seconds_elapsed = delta_time.seconds
    with open(LOG_FILE, "a") as f:
        f.write("Converted \"{}\" in {} second(s). Went from {:.2f} MB to {:.2f} MB ({:.2f}% smaller).\n".format(song_title, seconds_elapsed, wav_size, mp3_size, percent_smaller))


main_start_time = datetime.datetime.now()
number_of_songs = 0
all_files = get_all_files_in_dir(INPUT_DIR)
all_wav = filter_to_wav(all_files)

for song_path in all_wav:
    number_of_songs += 1
    new_song_path = get_new_file_name(song_path, OUTPUT_DIR)
    print("Converting ({}) to ({})".format(song_path, new_song_path))
    convert_wav_to_mp3(song_path, new_song_path)

main_end_time = datetime.datetime.now()
main_delta_time = main_end_time - main_start_time
main_seconds_elapsed = main_delta_time.seconds

print("Finished converting {} songs in {} seconds.".format(number_of_songs, main_seconds_elapsed))
with open(LOG_FILE, "a") as f:
    f.write("Finished converting {} songs in {} seconds.".format(number_of_songs, main_seconds_elapsed))