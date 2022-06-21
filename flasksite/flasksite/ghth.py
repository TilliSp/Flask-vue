from docxtpl import DocxTemplate
from docx.shared import Mm

doc = DocxTemplate(r"C:\Users\г\Documents\test_doc.docx")
context = {}
context['image'] = 'HJFGBFJHGRFUGH'
context['yyy'] = 'LLLLLLOLLLL'
# doc.add_picture(r"C:\Users\г\Documents\resized.png", width=Mm(35))
doc.render(context)
doc.save("generated.docx")
