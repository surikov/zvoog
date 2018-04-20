# Goals

This specification describes a plugin's framework for musical applications.

##Aim of this plugin framework

* help developers to extends existed musical applications by ready-made blocks
* define distribution center for publishing and discovering of plugins
* allow users to change functionality of musical applications without programming

##The primary paradigm

* functionality of plugins are discoverable and the information has human readable format
* host application doesn't depend from plugins code and can replace one pligin to another in realtime
* each plugin has input and output to connect into chain of AudioNodes
* host application and plugins can manage other plugins, a plugin know nothing about host

This specification omit performance of sound processing. Plugin can use plain JS, asm.js, JS in Worklet, native browser plugin or whatever.
This specification doesn't intended to direct copying or extending of any technology like Web Audio API, MIDI, VST.
