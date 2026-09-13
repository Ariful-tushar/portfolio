---
title: ImagineAlo — AI-Powered Smart Eyewear for the Visually Impaired
date: 2020-06-05
summary: A wearable smart-glasses device that gives blind and visually impaired users real-time awareness of their surroundings — recognizing objects and known faces through computer vision and speaking the results back through bone-conduction audio, without ever blocking the ear canal.
tech: [Python, OpenCV, YOLOv3, MTCNN, SVM, Raspberry Pi, IoT, Bluetooth, WiFi, Speech-to-Text, Text-to-Speech]
github: ""
demo: ""
featured: true
cover: cover.png
gallery: [architecture_diagram.png, product_render.png, use_case_demo.png]
funding: "Secured ~10,00,000 BDT (1,000,000 Bangladeshi Taka) in R&D grant funding from the ICT Division (ICT Ministry), Government of Bangladesh"
publication: "2020 IEEE Region 10 Symposium (TENSYMP), Dhaka, Bangladesh, 5–7 June 2020"
---

**Python** &nbsp;·&nbsp; **OpenCV / YOLOv3** &nbsp;·&nbsp; **MTCNN Face Recognition** &nbsp;·&nbsp; **Raspberry Pi (IoT)** &nbsp;·&nbsp; **Bone-Conduction Audio**

**Role:** Co-developer — computer vision & embedded systems (Arollo Tech Limited)
**Type:** Government-funded wearable AI hardware product, later published as peer-reviewed research

---

## Overview

ImagineAlo (product brand: **Alo** — "AI for Least Observed") is a wearable smart-glasses device built to give blind and visually impaired people a working set of eyes powered by computer vision. The glasses see the world through an onboard camera, listen for spoken commands through a built-in microphone, and speak back what they see — recognizing everyday objects and known faces in real time — through bone-conduction audio that vibrates against the jawbone instead of playing through an earpiece, so the wearer stays fully aware of their surroundings while listening to the device at the same time.

The project was developed at Arollo Tech Limited and secured close to **10,00,000 BDT (1 million Bangladeshi Taka)** in R&D grant funding from Bangladesh's ICT Division (ICT Ministry) to build it from concept to a working, field-tested wearable. It was later validated by giving the finished device to a person who had lost his eyesight after an injury, collecting real usage feedback outside the lab — and the underlying system was published as a peer-reviewed paper at the 2020 IEEE Region 10 Symposium (TENSYMP) in Dhaka.

---

## Key Features

- **Real-time object recognition** — Identifies common everyday objects from the live camera feed using a YOLOv3 deep learning model, announcing results with 85–100% accuracy in real-world testing.
- **Known-face recognition** — Detects and identifies familiar people using an MTCNN + SVM pipeline, tested across roughly 8,000 images of 15 people to validate accuracy before deployment.
- **Bone-conduction audio feedback** — Delivers all spoken results through a bone-conduction transducer built into the frame, which bypasses the ear canal entirely so the wearer can hear the device and the real world at the same time.
- **Bilingual voice command interface** — Understands and responds to spoken commands in both English and Bengali, converting speech to text for processing and text back to speech for the response.
- **Built-in knowledge assistant** — Answers general spoken questions by querying Wikipedia and reading the result back through the same audio pipeline.
- **Lightweight, purpose-built hardware** — A custom 3D-printed eyeglass frame weighing just 182 grams, engineered to fit the camera, processing board, battery, and audio hardware without becoming impractical to wear.
- **On-device edge processing** — Runs on a Raspberry Pi with WiFi (for the camera video stream) and Bluetooth (for the microphone and audio feedback loop), with a dedicated lithium-polymer battery and boost/charging circuit sized for a full day of realistic use.
- **Validated with a real end user** — Rather than stopping at a lab demo, the finished prototype was handed to an actual blind user for real-world testing, and their feedback shaped the evaluation of the device's social impact.

---

## How It Works

1. **Listen** — The bone-conduction unit's built-in microphone picks up a spoken command and sends it to the processing unit over Bluetooth.
2. **Understand** — The Raspberry Pi converts the speech to text and determines what the wearer is asking for: a description of their surroundings, or a general question.
3. **See** — For a "look around" request, the processing unit pulls a live video stream from the glasses' camera over WiFi.
4. **Recognize** — Each frame is run through the object recognition (YOLOv3) and face recognition (MTCNN + SVM) models in real time.
5. **Answer** — For a general question, the system queries Wikipedia instead of the camera pipeline.
6. **Speak back** — The result — an object, a recognized face, or an answer — is converted to speech and sent over Bluetooth to the bone-conduction unit.
7. **Hear** — The wearer hears the answer through jawbone vibration, without anything covering or blocking their ears.

See `images/architecture_diagram.png` for the full system view.

---

## Tech Stack & Skills Demonstrated

**Computer vision & AI**
Python · OpenCV · YOLOv3 (Darknet-53 backbone, trained on MS COCO) · MTCNN (3-stage cascaded face detector) · Support Vector Machine face classifier · model evaluation (precision/recall benchmarking between Haar Cascade and MTCNN)

**Embedded hardware & IoT**
Raspberry Pi (Raspbian) as the on-device processing unit · Sony Exmor IMX219 camera sensor (1080p60 / 8MP) · custom bone-conduction audio hardware · lithium-polymer battery with a boost/charging circuit (MH-CD42) · WiFi (video streaming) and Bluetooth (audio/mic) connectivity · 3D-printed enclosure design

**Voice interface**
Speech-to-text and text-to-speech pipelines · bilingual (English/Bengali) command support · Wikipedia-backed Q&A

**Engineering practice**
GPU-trained models (Ubuntu + Nvidia RTX 2070) deployed as lightweight inference weights to resource-constrained edge hardware · end-to-end power budgeting for a wearable device · real-user field testing beyond the lab

---

## Project Structure

```
ImagineAlo/
├── vision/
│   ├── object_detection/     # YOLOv3 (Darknet-53) — real-time object recognition
│   └── face_recognition/     # MTCNN detector + SVM identity classifier
├── voice/
│   ├── speech_to_text/       # Bilingual (EN/BN) command capture
│   └── text_to_speech/       # Spoken feedback generation
├── knowledge/                 # Wikipedia query & answer module
├── hardware/
│   ├── camera_module/         # Sony IMX219 driver & WiFi streaming
│   ├── bone_conduction_unit/  # Audio I/O — mic input, jawbone audio output
│   └── power_management/      # LiPo battery + MH-CD42 boost/charge circuit
└── enclosure/                  # 3D-printed eyeglass frame design
```

---

## Recognition & Publication

- **Funding:** Secured ~10,00,000 BDT (1,000,000 Bangladeshi Taka) in R&D grant funding from the ICT Division (ICT Ministry), Government of Bangladesh, to support development from prototype to field-tested device.
- **Published paper:** *"An Assistance System for Visually Challenged People Based on Computer Vision and IOT"* — 2020 IEEE Region 10 Symposium (TENSYMP), Dhaka, Bangladesh, 5–7 June 2020. IEEE ISBN: 978-1-7281-7366-5.
- **Authors:** Akash Bhuiyan, Md Ariful Islam, Md Hasan Shahriar, Tahmir Hasan Supto, Mohammad Abul Kasem, Mohammad Eusuf Daud — Arollo Tech Limited / Alo Ltd.
- **DOI:** could not be independently confirmed via automated search for this write-up — IEEE Xplore blocks automated lookups from this environment. Pull the exact DOI from your IEEE Xplore author page or the paper's own PDF/certificate and drop it into this section before publishing.

---

## Results

- Object recognition achieved **85–100% accuracy** on live camera feed across both indoor and outdoor test environments.
- Face recognition model comparison (tested on 7,628 images):

  | Model | Recall | Precision |
  |---|---|---|
  | Haar Cascade | 81.70% | 91.53% |
  | MTCNN | 93.55% | 96.83% |

  MTCNN was selected for the final product despite being slower than Haar Cascade, because accuracy mattered more than speed for a device built for blind users.
- Final prototype weight: **182 grams**, with battery performance tracked over a month of real use (full discharge cycle of roughly 1 hour under active use).
- Field-tested with a real blind end user outside the lab environment, with feedback used to assess the device's practical, everyday impact.
