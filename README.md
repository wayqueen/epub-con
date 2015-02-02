# epub-con
E Pub Conversion Task

- Install Node
- Install Grunt
- Buka directory opf
- Clone repository dari `https://github.com/ifdion/epub-con.git`, atau copy dari direktori opf sebelumnya
- Masuk ke directory repository `epub-con`
- Install modul `npm install`
- Jalankan perintah `grunt dev` untuk
  - menghapus `</b><b>`
  - menghapus inline style
  - merapihkan indent
  - menyalin `styles.css` dan `exercises.css`
- Jalankan perintah `grunt build` untuk
  - mengompres file sebagai `.epub`
