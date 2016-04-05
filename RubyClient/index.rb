$LOAD_PATH.unshift File.expand_path '../lib', File.dirname(__FILE__)
require 'rubygems'
require 'socket.io-client-simple'

url = ARGV.shift || 'http://192.168.0.110:8080'
socket = SocketIO::Client::Simple.connect url

socket.on :connect do
  puts 'connected!!!'
end

socket.on :disconnect do
  puts 'disconnected!!!'
end

socket.on :chat_message do |data|
  puts data
end

socket.on :error do |err|
  p err
end

puts 'please input and press Enter key'
loop do
  msg = STDIN.gets.strip
  next if msg.empty?
  socket.emit(:chat_message, msg: msg, at: Time.now)
end
